import { screen, render } from "@testing-library/react";
import Footer from "../components/Footer";


test("copyright information is displayed in the header", () => {
    const date = new Date()
    render(
        <Footer>
        </Footer>
    )
    expect(screen.getByText(`©Copyright ${date.getFullYear()}`)).toBeInTheDocument()
})