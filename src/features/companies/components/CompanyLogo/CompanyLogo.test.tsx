import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompanyLogo } from "./CompanyLogo";

describe("CompanyLogo", () => {
  it("updates the image when the assigned company changes", () => {
    const { rerender } = render(
      <CompanyLogo
        theme="light"
        company={{ id: "a", name: "Empresa A", logoUrl: "/a.svg" }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Logo de Empresa A" }),
    ).toHaveAttribute("src", "/a.svg");
    rerender(
      <CompanyLogo
        theme="light"
        company={{ id: "b", name: "Empresa B", logoUrl: "/b.svg" }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Logo de Empresa B" }),
    ).toHaveAttribute("src", "/b.svg");
    expect(
      screen.queryByRole("img", { name: "Logo de Empresa A" }),
    ).not.toBeInTheDocument();
  });

  it("uses a dark variant when provided and otherwise the normal logo", () => {
    const company = {
      id: "a",
      name: "Empresa A",
      logoUrl: "/a.svg",
      darkLogoUrl: "/a-dark.svg",
    };
    const { rerender } = render(<CompanyLogo theme="dark" company={company} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a-dark.svg");
    rerender(<CompanyLogo theme="light" company={company} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a.svg");
    rerender(
      <CompanyLogo
        theme="dark"
        company={{ ...company, darkLogoUrl: undefined }}
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/a.svg");
  });

  it("falls back on failure and retries when the logo changes", () => {
    const company = { id: "a", name: "Empresa A", logoUrl: "/missing.svg" };
    const { rerender } = render(
      <CompanyLogo theme="light" company={company} />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(
      screen.getByRole("img", { name: "Empresa: Empresa A" }),
    ).toBeInTheDocument();
    rerender(
      <CompanyLogo
        theme="light"
        company={{ ...company, logoUrl: "/fixed.svg" }}
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/fixed.svg");
    rerender(<CompanyLogo theme="light" />);
    expect(
      screen.getByRole("img", { name: "Empresa: CATiH NOC" }),
    ).toBeInTheDocument();
  });
});
