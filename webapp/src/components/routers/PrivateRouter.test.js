import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { PrivateRouter } from "../routers/PrivateRouter";
import AuthContext from "../contextProviders/AuthContext";

// Function to render the PrivateRouter with the AuthContext
const renderWithAuth = (contextValue, children) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter>
        <PrivateRouter>{children}</PrivateRouter>
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

describe("PrivateRouter", () => {
  it("renders an empty fragment while loading", () => {
    // Render the component while the authentication is still loading
    renderWithAuth({ token: null, isValidToken: jest.fn(), isLoading: true }, <div>Protected</div>);
    // Expect that the protected content is NOT visible during loading
    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
  });

it("renders the children if the token is valid", async () => {
    // Mock isValidToken to resolve to true (token is valid)
    const mockIsValidToken = jest.fn().mockResolvedValue(true);
    renderWithAuth({ token: "valid-token", isValidToken: mockIsValidToken, isLoading: false }, <div>Protected</div>);


    await waitFor(() => {
        expect(screen.getByText("Protected")).toBeInTheDocument();
    });
});

  it("redirects to login if the token is invalid", async () => {
    // Mock isValidToken to resolve to false (token is invalid)
    const mockIsValidToken = jest.fn().mockResolvedValue(false);
    renderWithAuth({ token: "invalid-token", isValidToken: mockIsValidToken, isLoading: false }, <div>Protected</div>);

    await waitFor(() => {
      // It checks that the protected content is not rendered
      expect(screen.queryByText("Protected")).not.toBeInTheDocument();
      // It checks that the redirection message is shown
      expect(screen.getByText("Redirecting to /login")).toBeInTheDocument();
    });
  });
});
