export default {
    test: {
        silent: true,
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['tests/unit/*.test.js'],
                },
            },
            {
                test: {
                    name: 'integration',
                    include: ['tests/int/*.int.test.js'],
                    pool: 'forks',
                    singleFork: true,
                },
            },
        ],
    },
};