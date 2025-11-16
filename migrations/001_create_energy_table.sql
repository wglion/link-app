-- 创建能量数据表
CREATE TABLE IF NOT EXISTS energy_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    energy_value INTEGER NOT NULL DEFAULT 0,
    energy_type VARCHAR(50) NOT NULL, -- 'physical', 'mental', 'emotional'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_energy_user_date ON energy_data(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_energy_type ON energy_data(energy_type);

-- 启用行级安全策略
ALTER TABLE energy_data ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "用户只能访问自己的能量数据" ON energy_data
    FOR ALL USING (auth.uid() = user_id);

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_energy_updated_at BEFORE UPDATE ON energy_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();