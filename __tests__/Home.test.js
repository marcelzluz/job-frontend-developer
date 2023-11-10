import { render, screen } from '@testing-library/react';
import Home from '@/app/page'


describe('Home', () => {
    it('renders a heading', () => {
        render(<Home />); //ARRANGE
        const heading = screen.getByRole('heading', { name: /melody explorer/i }); //ACT


        expect(heading).toBeInTheDocument(); //ASSERT
    });
});