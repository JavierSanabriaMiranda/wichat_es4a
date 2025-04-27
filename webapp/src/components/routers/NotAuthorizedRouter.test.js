import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotAuthorizedRouter } from "../routers/NotAuthorizedRouter";
import AuthContext from "../contextProviders/AuthContext";

// Helper function to render NotAuthorizedRouter wrapped with AuthContext and MemoryRouter
const renderWithAuth = (contextValue, children) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter>
        <NotAuthorizedRouter>{children}</NotAuthorizedRouter>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

// Mock the Navigate component from react-router to easily detect redirections
jest.mock('react-router', () => {
  const originalModule = jest.requireActual('react-router');
  return {
    ...originalModule,
    Navigate: ({ to }) => <div>Redirecting to {to}</div>,
  };
});

describe("NotAuthorizedRouter", () => {

  it("renders an empty fragment while loading", () => {
    // Render while authentication is still loading
    renderWithAuth({ token: null, isValidToken: jest.fn(), isLoading: true }, <div>Public Page</div>);
    
    // Expect that the public page is NOT visible during loading
    expect(screen.queryByText("Public Page")).not.toBeInTheDocument();
  });

  it("renders the children if the user is NOT authenticated", async () => {
    // Mock isValidToken to resolve to false (user is not authenticated)
    const mockIsValidToken = jest.fn().mockResolvedValue(false);

    renderWithAuth({ token: "invalid-token", isValidToken: mockIsValidToken, isLoading: false }, <div>Public Page</div>);

    await waitFor(() => {
      // Expect that the public page (like login) is rendered
      expect(screen.getByText("Public Page")).toBeInTheDocument();
    });
  });

  it("redirects to home if the user IS authenticated", async () => {
    // Mock isValidToken to resolve to true (user is authenticated)
    const mockIsValidToken = jest.fn().mockResolvedValue(true);

    renderWithAuth({ token: "valid-token", isValidToken: mockIsValidToken, isLoading: false }, <div>Public Page</div>);

    await waitFor(() => {
      // Expect that the public page is NOT displayed
      expect(screen.queryByText("Public Page")).not.toBeInTheDocument();
      
      // Expect that the redirection to home is displayed instead
      expect(screen.getByText("Redirecting to /")).toBeInTheDocument();
    });
  });

});
