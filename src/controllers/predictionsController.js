const supabase = require('../../config/supabase');

// Pobieranie historii predykcji użytkownika
exports.getPredictions = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Brak autoryzacji' });

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ error: 'Błąd autoryzacji' });

        const { data, error } = await supabase
            .from('prediction_history')
            .select('*')
            .eq('user_id', user.id)
            .order('prediction_date', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('❌ Błąd pobierania predykcji:', err);
        res.status(500).json({ error: 'Nie udało się pobrać predykcji' });
    }
};

// Wykonywanie nowej predykcji
exports.createPrediction = async (req, res) => {
    const { inputs, modelId } = req.body;

    if (!inputs || typeof inputs !== 'object' || !modelId) {
        return res.status(400).json({ error: 'Nieprawidłowe dane wejściowe' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Brak autoryzacji' });

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ error: 'Błąd autoryzacji' });

        let predictionResult;
        let modelName;

        switch (modelId) {
            case 'test_model':
                predictionResult = {
                    sprint_30m_prediction: (inputs.time_30m || 5) - 0.2,
                    jump_prediction: (inputs.jump_height || 50) + 10
                };
                modelName = 'Testowy Model';
                break;

            case 'pmml_neural':
                predictionResult = {
                    sprint_30m_prediction: (inputs.time_30m || 5) * 0.9,
                    jump_prediction: (inputs.jump_height || 50) * 1.1
                };
                modelName = 'PMML Sieć Neuronowa';
                break;

            default:
                throw new Error('Nieznany model predykcyjny');
        }

        const predictionData = {
            user_id: user.id,
            prediction_date: new Date().toISOString(),
            model_name: modelName,
            input_data: inputs,
            prediction_result: {
                Adjustet_Prediction: predictionResult.sprint_30m_prediction
            }
        };

        const { error } = await supabase.from('prediction_history').insert([predictionData]);
        if (error) throw error;

        res.json({
            model: predictionData.model_name,
            inputs: predictionData.input_data,
            result: predictionData.prediction_result,
            timestamp: predictionData.prediction_date
        });

    } catch (err) {
        console.error('❌ Błąd podczas przetwarzania predykcji:', err);
        res.status(500).json({ error: 'Nie udało się przeprowadzić predykcji' });
    }
};