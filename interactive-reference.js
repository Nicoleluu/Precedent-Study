document.addEventListener('DOMContentLoaded', () => {
    const explorer = document.querySelector('[data-provenance-explorer]');
    if (!explorer) return;

    const stages = {
        collection: {
            title: 'Collection decides who becomes visible.',
            body: 'A dataset begins by selecting people, places, moments, and behaviors. What is not collected cannot be represented by the model.',
            questions: ['Who was observed?', 'Who was excluded?', 'Was participation voluntary?'],
            dataset: 'Selected records',
            visual: 'Faded and crossed-out points represent people or events excluded during collection.'
        },
        classification: {
            title: 'Categories are designed, not discovered.',
            body: 'People are sorted into groups that may appear natural but reflect administrative, cultural, and technical decisions.',
            questions: ['Who defined the groups?', 'Who does not fit?', 'Which differences are erased?'],
            dataset: 'Assigned categories',
            visual: 'Circles, squares, and diamonds show how continuous differences are forced into discrete categories.'
        },
        labeling: {
            title: 'Labels turn judgments into ground truth.',
            body: 'Terms such as “sick,” “risky,” or “successful” may combine observation with institutional interpretation and proxy measures.',
            questions: ['Who assigned the label?', 'Is it a fact or a proxy?', 'Whose judgment becomes truth?'],
            dataset: 'Labeled outcomes',
            visual: 'Pink and green points show records assigned opposing labels, even though the underlying people remain more complex.'
        },
        measurement: {
            title: 'Measurement determines what can count.',
            body: 'Tools, thresholds, missing records, and uneven data quality shape the patterns later treated as evidence.',
            questions: ['What was measured?', 'What remained invisible?', 'Who experiences more measurement error?'],
            dataset: 'Measured proxies',
            visual: 'Outlined points are measured confidently; blurred points represent missing, uncertain, or lower-quality measurements.'
        },
        history: {
            title: 'History is embedded in the base rate.',
            body: 'Observed differences may reflect unequal access, discrimination, enforcement, environmental exposure, or previous institutional decisions.',
            questions: ['Why are outcomes different?', 'Does the data record inequality?', 'Will the model reproduce it?'],
            dataset: 'Historical conditions',
            visual: 'The unequal background bands show that records enter the dataset from different structural conditions—not from a level field.'
        }
    };

    let activeStage = null;
    const points = explorer.querySelector('[data-points]');
    const dataBox = explorer.querySelector('[data-box]');
    const progress = explorer.querySelector('[data-progress]');
    const datasetLabel = explorer.querySelector('[data-dataset-label]');
    const explanation = explorer.querySelector('[data-explanation]');
    const influences = explorer.querySelector('[data-influences]');

    points.innerHTML = Array.from({ length: 48 }, (_, index) =>
        `<i class="raw-point" style="--i:${index}" aria-hidden="true"></i>`
    ).join('');

    function render() {
        explorer.querySelectorAll('[data-stage]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.stage === activeStage));
        });

        points.dataset.stage = activeStage || 'neutral';
        dataBox.dataset.stage = activeStage || 'neutral';

        if (!activeStage) {
            progress.textContent = 'Select one lens to inspect the dataset';
            datasetLabel.textContent = 'Appears neutral';
            influences.innerHTML = '<span class="neutral-key">Gray circles = records presented as neutral</span>';
            explanation.querySelector('span').textContent = 'No lens selected';
            explanation.querySelector('h3').textContent = 'The clean dataset is an illusion.';
            explanation.querySelector('p').textContent = 'Every dataset is produced through choices about people, categories, labels, measurements, and history.';
            explanation.querySelector('[data-questions]').innerHTML = '<li>Who created the dataset?</li><li>What decisions happened before the model?</li>';
            explanation.querySelector('[data-visual-key] span').textContent = 'The gray circles represent records before a particular influence is examined.';
            return;
        }

        const stage = stages[activeStage];
        progress.textContent = `Viewing lens: ${activeStage}`;
        datasetLabel.textContent = stage.dataset;
        influences.innerHTML = `<span class="influence influence--${activeStage}">${activeStage}<i>↓ changes shown below</i></span>`;
        explanation.querySelector('span').textContent = `Selected lens / ${activeStage}`;
        explanation.querySelector('h3').textContent = stage.title;
        explanation.querySelector('p').textContent = stage.body;
        explanation.querySelector('[data-questions]').innerHTML = stage.questions.map(question => `<li>${question}</li>`).join('');
        explanation.querySelector('[data-visual-key] span').textContent = stage.visual;
    }

    explorer.addEventListener('click', event => {
        const stageButton = event.target.closest('[data-stage]');
        if (stageButton) {
            activeStage = stageButton.dataset.stage;
            render();
            return;
        }

        if (event.target.closest('[data-reset]')) {
            activeStage = null;
            render();
        }
    });

    render();
});
