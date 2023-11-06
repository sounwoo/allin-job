export const randomSolution = (el: string): string[] => {
    const commonCompetitionOutside = [
        'mainImage',
        'enterprise',
        'title',
        'Dday',
        'interests',
        'target',
    ];
    const randomSolution = {
        competition: [...commonCompetitionOutside],
        outside: [...commonCompetitionOutside, 'location'],
        qnet: ['institution', 'title', 'examSchedules'],
        intern: [
            'mainImage',
            'preferentialTreatment',
            'title',
            'location',
            'period',
        ],
    };

    return randomSolution[
        (el as 'competition') || 'outside' || 'qnet' || 'intern'
    ];
};
