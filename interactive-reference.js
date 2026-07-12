document.addEventListener('DOMContentLoaded', () => {
    const explorer = document.querySelector('[data-provenance-explorer]');
    if (!explorer) return;

    const stages = {
        collection: {
            title: 'Collection decides who becomes visible.',
            body: 'A dataset begins by selecting people, places, moments, and behaviors. What is not collected cannot be represented by the model.',
            questions: ['Who was observed?', 'Who was excluded?', 'Was participation voluntary?'],
            influence: 'Selection',
            className: 'is-collected'
        },
        classification: {
            title: 'Categories are designed, not discovered.',
            body: 'People are sorted into groups that may appear natural but reflect administrative, cultural, and technical decisions.',
            questions: ['Who defined the groups?', 'Who does not fit?', 'Which differences are erased?'],
            influence: 'Categories',
            className: 'is-classified'
        },
        labeling: {
            title: 'Labels turn judgments into ground truth.',
            body: 'Terms such as “sick,” “risky,” or “successful” may combine observation with institutional interpretation and proxy measures.',
            questions: ['Who assigned the label?', 'Is it a fact or a proxy?', 'Whose judgment becomes truth?'],
            influence: 'Labels',
            className: 'is-labeled'
        },
        measurement: {
            title: 'Measurement determines what can count.',
            body: 'Tools, thresholds, missing records, and uneven data quality shape the patterns later treated as evidence.',
            questions: ['What was measured?', 'What remained invisible?', 'Who experiences more measurement error?'],
            influence: 'Instruments',
            className: 'is-measured'
        },
        history: {
            title: 'History is embedded in the base rate.',
            body: 'Observed differences may reflect unequal access, discrimination, enforcement, environmental exposure, or previous institutional decisions.',
            questions: ['Why are outcomes different?', 'Does the data record inequality?', 'Will the model reproduce it?'],
            influence: 'History',
            className: 'is-historical'
        }
    };

    const active = new Set();
    const points = explorer.querySelector('[data-points]');
    const dataBox = explorer.querySelector('[data-box]');
    const influences = explorer.querySelector('[data-influences]');
    const progress = explorer.querySelector('[data-progress]');
    const datasetLabel = explorer.querySelector('[data-dataset-label]');
    const explanation = explorer.querySelector('[data-explanation]');
    const conclusion = document.querySelector('[data-conclusion]');

    points.innerHTML = Array.from({ length: 48 }, (_, index) =>
        `<i class="raw-point" style="--i:${index}" aria-hidden="true"></i>`
    ).join('');

    function showExplanation(key) {
        const stage = stages[key];
        explanation.querySelector('span').textContent = `Revealed influence / ${stage.influence}`;
        explanation.querySelector('h3').textContent = stage.title;
        explanation.querySelector('p').textContent = stage.body;
        explanation.querySelector('[data-questions]').innerHTML = stage.questions.map(q => `<li>${q}</li>`).join('');
    }

    function render() {
        Object.values(stages).forEach(stage => dataBox.classList.toggle(stage.className, active.has(Object.keys(stages).find(key => stages[key] === stage))));

        explorer.querySelectorAll('[data-stage]').forEach(button => {
            button.setAttribute('aria-pressed', String(active.has(button.dataset.stage)));
        });

        influences.innerHTML = [...active].map(key =>
            `<span class="influence influence--${key}">${stages[key].influence}<i>↓</i></span>`
        ).join('');

        progress.textContent = `${active.size} of 5 decisions revealed`;
        datasetLabel.textContent = active.size === 0
            ? 'Appears neutral'
            : active.size === 5
                ? 'Situated and constructed'
                : 'Being shaped';

        points.dataset.activeCount = active.size;
        conclusion.hidden = active.size !== 5;
    }

    explorer.addEventListener('click', event => {
        const button = event.target.closest('[data-stage]');
        if (button) {
            const key = button.dataset.stage;
            active.has(key) ? active.delete(key) : active.add(key);
            showExplanation(key);
            render();
            return;
        }

        if (event.target.closest('[data-reset]')) {
            active.clear();
            explanation.querySelector('span').textContent = 'Select a stage';
            explanation.querySelector('h3').textContent = 'The clean dataset is an illusion.';
            explanation.querySelector('p').textContent = 'Every dataset is produced through choices about people, categories, labels, measurements, and history.';
            explanation.querySelector('[data-questions]').innerHTML = '<li>Who created the dataset?</li><li>What decisions happened before the model?</li>';
            render();
        }
    });

    render();
});
