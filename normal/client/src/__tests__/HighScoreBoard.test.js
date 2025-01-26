import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HighScoreBoard } from '../components/HighScoreBoard';
import showHighScoreReducer from '../reducers/showHighScoreSlice';

// Mock store setup
const createTestStore = () => {
    return configureStore({
        reducer: {
            showHighScore: showHighScoreReducer,
        },
    });
};

describe('HighScoreBoard Component', () => {
    let store;

    beforeEach(() => {
        store = createTestStore();
    });

    test('renders empty state correctly', () => {
        render(
            <Provider store={store}>
                <HighScoreBoard scoresList={[]} />
            </Provider>
        );

        expect(screen.getByText('No Score Yet')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    test('renders scores list correctly', () => {
        const mockScores = [
            { name: 'Player1', scores: 100, nature: 'Solo' },
            { name: 'Player2', scores: 200, nature: 'Multi' },
        ];

        render(
            <Provider store={store}>
                <HighScoreBoard scoresList={mockScores} />
            </Provider>
        );

        expect(screen.getByText("Player's Name")).toBeInTheDocument();
        expect(screen.getByText('Best score')).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        
        expect(screen.getByText('Player1')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('Solo')).toBeInTheDocument();
        
        expect(screen.getByText('Player2')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('Multi')).toBeInTheDocument();
    });

    test('Go Back button dispatches showHighScoreOff', () => {
        render(
            <Provider store={store}>
                <HighScoreBoard scoresList={[]} />
            </Provider>
        );

        const backButton = screen.getByText('Go Back');
        fireEvent.click(backButton);

        const state = store.getState();
        expect(state.showHighScore).toBe(false);
    });

    test('renders grid layout correctly', () => {
        const mockScores = [
            { name: 'Player1', scores: 100, nature: 'Solo' },
        ];

        render(
            <Provider store={store}>
                <HighScoreBoard scoresList={mockScores} />
            </Provider>
        );

        const gridContainers = document.getElementsByClassName('grid-container');
        expect(gridContainers.length).toBe(2); // Title grid + one score entry

        const titleItems = document.getElementsByClassName('jtem1');
        expect(titleItems[0]).toHaveTextContent("Player's Name");

        const scoreItems = document.getElementsByClassName('item1');
        expect(scoreItems[0]).toHaveTextContent('Player1');
    });

    test('handles long score lists', () => {
        const mockScores = Array.from({ length: 10 }, (_, i) => ({
            name: `Player${i}`,
            scores: i * 100,
            nature: i % 2 === 0 ? 'Solo' : 'Multi'
        }));

        render(
            <Provider store={store}>
                <HighScoreBoard scoresList={mockScores} />
            </Provider>
        );

        mockScores.forEach(score => {
            expect(screen.getByText(score.name)).toBeInTheDocument();
            expect(screen.getByText(score.scores.toString())).toBeInTheDocument();
            expect(screen.getByText(score.nature)).toBeInTheDocument();
        });
    });
});
