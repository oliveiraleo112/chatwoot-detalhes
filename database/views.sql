-- 
-- AGROFEL SALES OS - DATABASE SCHEMA
-- Author: Senior RevOps Engineer
-- Target: PostgreSQL 14+ (Chatwoot DB)
--

-- 1. Helper function for Calendar (Simulating dbt Date Dimension)
CREATE OR REPLACE FUNCTION get_br_calendar(start_date DATE, end_date DATE)
RETURNS TABLE (
    date_day DATE,
    day_name TEXT,
    month_name TEXT,
    year_actual INT,
    is_weekend BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d::DATE,
        to_char(d, 'TMDay'),
        to_char(d, 'TMMonth'),
        EXTRACT(YEAR FROM d)::INT,
        EXTRACT(ISODOW FROM d) IN (6, 7)
    FROM generate_series(start_date, end_date, '1 day'::interval) d;
END;
$$ LANGUAGE plpgsql;

-- 2. Materialized View: Current Funnel Stage (The "Snapshot")
-- Logic: Priority OPORTUNIDADE > SQL > SAL > MQL
CREATE MATERIALIZED VIEW vw_funnel_current_stage AS
WITH latest_conversations AS (
    SELECT 
        c.id,
        c.contact_id,
        c.custom_attributes,
        c.updated_at,
        c.labels
    FROM conversations c
    WHERE c.status <> 'resolved' -- Only open items
),
scored_leads AS (
    SELECT 
        c.id,
        c.contact_id,
        -- Score Calculation Agrofel v2
        (
            CASE WHEN (c.custom_attributes->>'tamanho_propriedade') = 'Extra Grande' THEN 40 ELSE 0 END +
            CASE WHEN CAST(COALESCE(c.custom_attributes->>'ticket_estimado_num', '0') AS NUMERIC) > 200000 THEN 30 ELSE 0 END +
            CASE WHEN (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) > 15 THEN 20 ELSE 0 END +
            CASE WHEN (c.custom_attributes->>'origem_lead') IN ('Indicação', 'Evento Agrofel') THEN 10 ELSE 0 END -
            LEAST(30, FLOOR(EXTRACT(EPOCH FROM (NOW() - c.updated_at))/86400 / 3) * 5)
        )::INT as lead_score,
        c.labels
    FROM latest_conversations c
)
SELECT 
    lc.id as conversation_id,
    lc.contact_id,
    sl.lead_score,
    CASE 
        WHEN lc.labels @> '{"OPORTUNIDADE"}' THEN 'OPORTUNIDADE'
        WHEN lc.labels @> '{"SQL"}' THEN 'SQL'
        WHEN lc.labels @> '{"SAL"}' THEN 'SAL'
        WHEN lc.labels @> '{"MQL"}' THEN 'MQL'
        ELSE 'LEAD' 
    END as current_stage,
    lc.updated_at as last_interaction_at
FROM latest_conversations lc
JOIN scored_leads sl ON lc.id = sl.id;

CREATE INDEX idx_vw_funnel_stage ON vw_funnel_current_stage(current_stage);
CREATE INDEX idx_vw_funnel_score ON vw_funnel_current_stage(lead_score DESC);


-- 3. Materialized View: Lead Journey (Time in Stage Analysis)
-- Uses LAG to calculate time spent in previous stages
CREATE MATERIALIZED VIEW vw_funnel_lead_journey AS
WITH label_events AS (
    SELECT 
        conversation_id,
        label_name,
        created_at as event_time
    FROM conversation_labels
    WHERE label_name IN ('MQL', 'SAL', 'SQL', 'OPORTUNIDADE')
),
journey_calc AS (
    SELECT 
        conversation_id,
        label_name as stage,
        event_time as entry_time,
        LEAD(event_time) OVER (PARTITION BY conversation_id ORDER BY event_time) as exit_time
    FROM label_events
)
SELECT 
    conversation_id,
    stage,
    entry_time,
    COALESCE(exit_time, NOW()) as exit_time,
    EXTRACT(EPOCH FROM (COALESCE(exit_time, NOW()) - entry_time))/86400 as days_in_stage
FROM journey_calc;


-- 4. Materialized View: Historical Daily Snapshot (For Area Charts)
-- Requires storing history, usually done via dbt snapshots, but simulating here with a cross join on calendar
CREATE MATERIALIZED VIEW vw_funnel_historical_daily AS
SELECT 
    d.date_day,
    f.current_stage,
    COUNT(*) as volume,
    AVG(f.lead_score) as avg_score,
    SUM(CASE WHEN f.lead_score > 80 THEN 1 ELSE 0 END) as high_quality_volume
FROM get_br_calendar('2024-01-01', NOW()::DATE) d
CROSS JOIN vw_funnel_current_stage f
-- In a real scenario, this would join against a daily snapshot table
-- For this exercise, we assume current state applies (simplified for SQL demo)
GROUP BY 1, 2
ORDER BY 1 DESC, 2;
