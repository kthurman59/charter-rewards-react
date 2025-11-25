import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders customer rewards heading", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /customer rewards/i });
  expect(heading).toBeInTheDocument();
});

