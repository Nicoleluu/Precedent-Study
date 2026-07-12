document.addEventListener('DOMContentLoaded', () => {
    const explorer = document.querySelector('[data-provenance-explorer]');
    if (!explorer) return;

    const stages = {
        included: {
            title: 'The dataset represents some people more clearly than others.',
            body: 'Before analysis begins, someone determines whose information enters the dataset. People who are absent, underrepresented, or difficult to observe become less visible to the model.',
            questions: ['Whose information is present?', 'Who is missing?', 'Does this sample represent the population?'],
            dataset: 'Selected people',
            visual: 'Faded and reduced points represent people whose information was excluded or underrepresented.'
        },
        collector: {
            title: 'The collector decides what becomes a record.',
            body: 'Data is gathered by an actor with a goal. That actor chooses what to observe, whom to ask, and how to record it. The resulting dataset reflects those choices.',
            questions: ['Who needed the data?', 'What were they trying to learn or decide?', 'What did their purpose make visible or overlook?'],
            dataset: 'Records chosen for a purpose',
            visual: 'Blue circles become selected records. Small faded circles remain overlooked, showing that the collector’s purpose affects which parts of the world enter the dataset.'
        },
        recorded: {
            title: 'Only selected parts of a situation become data.',
            body: 'A dataset records particular fields while leaving other circumstances unobserved. What is easy to count may replace what is actually important.',
            questions: ['What information was recorded?', 'Which circumstances were left out?', 'Can these fields represent the whole situation?'],
            dataset: 'Selected fields',
            visual: 'Outlined points represent recorded fields; blurred points represent context that was unavailable, uncertain, or never measured.'
        },
        interpreted: {
            title: 'The interpreter chooses the rule that gives a record meaning.',
            body: 'A record does not explain itself. A person or institution defines the categories and decides what evidence counts. Under a different rule, the same record can receive a different label.',
            questions: ['Who created the labeling rule?', 'What values are built into that rule?', 'Would another interpreter reach a different conclusion?'],
            dataset: 'Labels created by a chosen rule',
            visual: 'Each circle is split between green and pink to show the same unchanged record receiving two possible meanings under different rules.'
        },
        missing: {
            title: 'Missing context can turn circumstances into assumptions.',
            body: 'Personal, social, and institutional conditions often disappear when experience is converted into data. The model may then treat past inequality as evidence about an individual or group.',
            questions: ['What happened before this record?', 'What conditions affected the outcome?', 'Is inequality being mistaken for identity?'],
            dataset: 'Incomplete context',
            visual: 'Unequal background bands represent different conditions surrounding the records, including conditions the dataset may fail to explain.'
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
        explorer.querySelectorAll('button[data-stage]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.stage === activeStage));
        });

        points.dataset.stage = activeStage || 'neutral';
        dataBox.dataset.stage = activeStage || 'neutral';

        if (!activeStage) {
            progress.textContent = 'Select one question to inspect the dataset';
            datasetLabel.textContent = 'Appears neutral';
            influences.innerHTML = '<span class="neutral-key">Gray circles = records presented as neutral</span>';
            explanation.querySelector('span').textContent = 'No question selected';
            explanation.querySelector('h3').textContent = 'The clean dataset is an illusion.';
            explanation.querySelector('p').textContent = 'A dataset reflects who was included, who gathered the information, what they recorded, how they interpreted it, and what context was left out.';
            explanation.querySelector('[data-questions]').innerHTML = '<li>Who shaped the dataset?</li><li>What decisions happened before the model?</li>';
            explanation.querySelector('[data-visual-key] span').textContent = 'The gray circles represent records before one of these questions is examined.';
            return;
        }

        const stage = stages[activeStage];
        const selectedButton = explorer.querySelector(`[data-stage="${activeStage}"]`);
        const shortLabel = selectedButton.textContent.replace(/^\d+/, '').trim();
        progress.textContent = `Viewing: ${shortLabel}`;
        datasetLabel.textContent = stage.dataset;
        influences.innerHTML = `<span class="influence influence--${activeStage}">${shortLabel}<i>↓ visible effect</i></span>`;
        explanation.querySelector('span').textContent = `Selected question / ${shortLabel}`;
        explanation.querySelector('h3').textContent = stage.title;
        explanation.querySelector('p').textContent = stage.body;
        explanation.querySelector('[data-questions]').innerHTML = stage.questions.map(question => `<li>${question}</li>`).join('');
        explanation.querySelector('[data-visual-key] span').textContent = stage.visual;
    }

    explorer.addEventListener('click', event => {
        const stageButton = event.target.closest('button[data-stage]');
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
