import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameCreationForm from '../src/components/GameCreationForm';

vi.mock('../src/context/PlayersContext', () => ({
    usePlayers: () => ({
        players: [
            { id: 1, first_name: "Jim", last_name: "Jones" },
            { id: 2, first_name: "Sam", last_name: "Smith" }
        ]
    })
}));

vi.mock('../src/api/gameFunctions', () => ({
    default: {
        createGame: vi.fn().mockResolvedValue({ message: "Game Created" })
    }
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn()
}));

afterEach(() => {
    cleanup();
});

describe('GameCreationForm', () => {
    it('should render the form with default fields', () => {
        render(<GameCreationForm />);
        screen.getByText('Number of Rounds');
        screen.getByText('Player 1');
        screen.getByText('Submit');
    });

    it('should add a player field when + button is clicked', async () => {
        render(<GameCreationForm />);
        const addButton = screen.getByRole('button', { name: '+' });
        await userEvent.click(addButton);
        screen.getByText('Player 2');
    });

    it('should remove a player field when trash icon is clicked', async () => {
        const { container } = render(<GameCreationForm />);
        await userEvent.click(screen.getByRole('button', { name: '+' }));
        await screen.findByText(/Player 3/);
        fireEvent.click(container.querySelector('.trash-icon'));
        expect(screen.queryByText('Player 3')).toBeNull();
    });
    
    it('should hide the + button when player count reaches 8', async () => {
            render(<GameCreationForm />);
            
            for (let i = 0; i < 7; i++) {
                await userEvent.click(screen.getByRole('button', { name: '+' }));
            }

            expect(screen.queryByRole('button', { name: '+' })).toBeNull();
    });

    it('should call createGame with correct data on submit', async () => {
        const gameFunctions = await import('../src/api/gameFunctions');
        render(<GameCreationForm />);

        const selects = screen.getAllByRole('combobox');
        await userEvent.selectOptions(selects[1], '1');
        await userEvent.selectOptions(selects[2], '2');
        await userEvent.selectOptions(selects[0], '5');

        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(gameFunctions.default.createGame).toHaveBeenCalledWith({
            numRounds: 5,
            playersArray: [1, 2]
        });
    });
});
