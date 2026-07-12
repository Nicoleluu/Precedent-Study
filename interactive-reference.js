document.addEventListener('DOMContentLoaded', () => {
    const lab = document.querySelector('[data-fairness-lab]');
    if (!lab) return;

    const definitions = {
        adults: { prevalence: 0.25, phase: 3 },
        children: { prevalence: 0.50, phase: 11 }
    };

    const groupStates = {};

    function pct(value) {
        return `${Math.round(value * 100)}%`;
    }

    function safeDivide(a, b) {
        return b === 0 ? 0 : a / b;
    }

    function renderGroup(group) {
        const key = group.dataset.group;
        const definition = definitions[key];
        const threshold = Number(group.querySelector('[data-threshold]').value) / 100;
        const total = 40;
        const sickTotal = Math.round(total * definition.prevalence);
        const recallTarget = 0.35 + threshold * 0.62;
        const falsePositiveTarget = 0.03 + threshold * 0.52;

        let tp = 0, fn = 0, fp = 0, tn = 0;
        const outcomes = [];

        for (let i = 0; i < total; i += 1) {
            const sick = i < sickTotal;
            const sample = ((i * 17 + definition.phase) % 41) / 40;
            const predictedPositive = sick
                ? sample < recallTarget
                : sample < falsePositiveTarget;

            let outcome;
            if (sick && predictedPositive) { outcome = 'tp'; tp += 1; }
            if (sick && !predictedPositive) { outcome = 'fn'; fn += 1; }
            if (!sick && predictedPositive) { outcome = 'fp'; fp += 1; }
            if (!sick && !predictedPositive) { outcome = 'tn'; tn += 1; }
            outcomes.push(outcome);
        }

        const recall = safeDivide(tp, tp + fn);
        const precision = safeDivide(tp, tp + fp);
        const specificity = safeDivide(tn, tn + fp);
        groupStates[key] = { recall, precision, specificity };

        group.querySelector('[data-people]').innerHTML = outcomes
            .map((outcome, index) => `<i class="person person--${outcome}" title="Case ${index + 1}: ${outcome.toUpperCase()}"></i>`)
            .join('');

        group.querySelector('[data-threshold-output]').value = pct(threshold);
        group.querySelector('[data-metric="recall"]').textContent = pct(recall);
        group.querySelector('[data-metric="precision"]').textContent = pct(precision);
        group.querySelector('[data-metric="specificity"]').textContent = pct(specificity);
    }

    function updateComparison() {
        const adult = groupStates.adults;
        const child = groupStates.children;
        if (!adult || !child) return;

        const differences = [
            ['recall', Math.abs(adult.recall - child.recall)],
            ['precision', Math.abs(adult.precision - child.precision)],
            ['specificity', Math.abs(adult.specificity - child.specificity)]
        ].sort((a, b) => a[1] - b[1]);

        const closest = differences[0];
        const furthest = differences[2];
        lab.querySelector('[data-comparison]').textContent =
            `${closest[0][0].toUpperCase() + closest[0].slice(1)} is closest (${Math.round(closest[1] * 100)}-point gap), while ${furthest[0]} differs by ${Math.round(furthest[1] * 100)} points.`;
    }

    const groups = [...lab.querySelectorAll('[data-group]')];
    groups.forEach(renderGroup);
    updateComparison();

    lab.addEventListener('input', (event) => {
        if (!event.target.matches('[data-threshold]')) return;
        renderGroup(event.target.closest('[data-group]'));
        updateComparison();
    });
});
