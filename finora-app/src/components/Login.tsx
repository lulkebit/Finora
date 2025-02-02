export default function Login() {
    return (
        <div>
            <h1>Login (Platzhalter)</h1>
            <form>
                <input type='email' placeholder='Email' />
                <input type='password' placeholder='Passwort' />
                <button type='submit'>Anmelden</button>
            </form>
            <a href='/register'>Registrieren</a>
        </div>
    );
}
