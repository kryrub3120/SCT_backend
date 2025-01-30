const supabase = require('../../config/supabase');

// Pobieranie historii predykcji
const getPredictions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('prediction_history')
            .select('*')
            .order('prediction_date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('❌ Błąd pobierania predykcji:', err);
        res.status(500).json({ error: 'Nie udało się pobrać predykcji' });
    }
};

// Przeprowadzanie predykcji
const makePrediction = async (req, res) => {
    const { inputs, modelId } = req.body;
    if (!inputs || !modelId) return res.status(400).json({ error: 'Nieprawidłowe dane' });

    try {
        let predictionResult = {};
        let modelName = 'Testowy Model';

        if (modelId === 'test_model') {
            predictionResult = {
                sprint_30m_prediction: (inputs.time_30m || 5) - 0.2,
                jump_prediction: (inputs.jump_height || 50) + 10
            };
        }

        const predictionData = {
            prediction_date: new Date().toISOString(),
            model_name: modelName,
            input_data: inputs,
            prediction_result: predictionResult
        };

        const { error } = await supabase.from('prediction_history').insert([predictionData]);
        if (error) throw error;

        res.json(predictionData);
    } catch (err) {
        console.error('❌ Błąd predykcji:', err);
        res.status(500).json({ error: 'Nie udało się przeprowadzić predykcji' });
    }
};

module.exports = { getPredictions, makePrediction };