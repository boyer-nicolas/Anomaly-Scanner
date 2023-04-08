import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react';
import
{
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";
import Login from "./Login";

function renderLogin()
{
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route exact path="/" index element={<Login />} />
        )
    );
    return render(
        <RouterProvider router={router} />
    );
}


describe('Login', () =>
{
    const testEmail = 'example@example.com';
    const testPassword = 'password';

    const { container } = renderLogin();

    const emailField = container.querySelector('input[name="email"]');
    const passwordField = container.querySelector('input[name="password"]');

    test('renders correctly', () =>
    {
        if (container)
        {
            expect(container).toBeDefined();
        }
    });

    test('form fields can be found', () =>
    {
        expect(emailField).toBeDefined();
        expect(passwordField).toBeDefined();
    })

    test('form fields are empty', () =>
    {
        expect(emailField.value).toBe('');
        expect(passwordField.value).toBe('');
    });

    test('form fields are empty and submitted', () =>
    {
        const { container } = renderLogin();
        container.querySelector('form').submit();
        expect(container.querySelector('alert')).toBeDefined();
    });

    test('form fields are filled', () =>
    {
        const { container } = renderLogin();
        emailField.value = testEmail;
        passwordField.value = testPassword;
        expect(emailField.value).toBe(testEmail);
        expect(passwordField.value).toBe(testPassword);
    });

    test('form fields are filled and submitted', () =>
    {
        const { container } = renderLogin();
        emailField.value = testEmail;
        passwordField.value = testPassword;
        container.querySelector('button[type="submit"]').click();
        expect(emailField.value).toBe(testEmail);
        expect(passwordField.value).toBe(testPassword);
    });

    test('form fields are filled and submitted with wrong credentials', () =>
    {
        const { container } = renderLogin();
        emailField.value = testEmail;
        passwordField.value = testPassword;
        container.querySelector('button[type="submit"]').click();
        expect(emailField.value).toBe(testEmail);
        expect(passwordField.value).toBe(testPassword);

        expect(container.querySelector('alert')).toBeDefined();
    });
}
);
