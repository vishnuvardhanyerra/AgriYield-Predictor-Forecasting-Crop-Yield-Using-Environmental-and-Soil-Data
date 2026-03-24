document.addEventListener('DOMContentLoaded', () => {
    const predictionForm = document.getElementById('predictionForm');
    const resultContainer = document.getElementById('resultContainer');
    const yieldValueSpan = document.getElementById('yieldValue');
    const predictBtn = document.getElementById('predictBtn');
    
    // Slider Logic
    const ranges = document.querySelectorAll('.custom-range');
    ranges.forEach(range => {
        const valSpan = range.parentElement.querySelector('.slider-val');
        range.addEventListener('input', () => {
            valSpan.textContent = range.value;
        });
    });

    // Prediction Logic
    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state to "Predicting..."
        const originalBtnContent = predictBtn.innerHTML;
        predictBtn.disabled = true;
        predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';

        // Simulate a delay
        setTimeout(() => {
            const formData = new FormData(predictionForm);
            const data = Object.fromEntries(formData.entries());
            const predictedYield = calculateSimulatedYield(data);

            yieldValueSpan.textContent = predictedYield.toFixed(2);
            resultContainer.classList.remove('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            predictBtn.disabled = false;
            predictBtn.innerHTML = originalBtnContent;
        }, 800);
    });

    /**
     * Simulated calculation for crop yield prediction.
     * @param {Object} data - The form data object.
     * @returns {number} - The predicted yield in kg/ha.
     */
    function calculateSimulatedYield(data) {
        const temp = parseFloat(data.temperature) || 27;
        const rain = parseFloat(data.rainfall) || 1000;
        const humid = parseFloat(data.humidity) || 70;
        const n = parseFloat(data.nitrogen) || 20;
        const p = parseFloat(data.phosphorus) || 10;
        const k = parseFloat(data.potassium) || 18;
        const ph = parseFloat(data.soilPh) || 6.5;
        const crop = data.crop;
        const soilType = data.soilType;

        // Base yield values from dataset patterns
        const baseYields = {
            'Rice': 3200,
            'Paddy': 3100,
            'Wheat': 3500,
            'Cotton': 3800,
            'Sugarcane': 3600,
            'Soybean': 3100,
            'Groundnut': 3400,
            'Millets': 3400,
            'Maize': 2800,
            'Pulses': 2700
        };

        let yield = baseYields[crop] || 3000;

        // Apply environmental impacts
        const tempDiff = Math.abs(temp - 26.5);
        yield -= tempDiff * 15;

        if (rain < 800) yield -= 200;
        if (rain > 1500) yield -= 100;

        const humidDiff = Math.abs(humid - 70);
        yield -= humidDiff * 5;

        // Nutrients Impact
        yield += (n - 20) * 0.5;
        yield += (p - 10) * 2;
        yield += (k - 18) * 0.3;

        const phDiff = Math.abs(ph - 7.0);
        yield -= phDiff * 150;

        // Soil Type Factor
        if (soilType === 'Alluvial') yield *= 1.05;
        if (soilType === 'Black') yield *= 1.08;

        const noise = (Math.random() - 0.5) * 50;
        yield += noise;

        return Math.max(1500, Math.min(5000, yield));
    }
});
