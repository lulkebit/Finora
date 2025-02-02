export default function Register() {
    return (
        <div>
            <h1>Registrierung (Platzhalter)</h1>
            <form>
                <input type='email' placeholder='Email' />
                <input type='password' placeholder='Passwort' />
                <input type='password' placeholder='Passwort bestätigen' />
                <button type='submit'>Konto erstellen</button>
            </form>
            <a href='/login'>Zum Login</a>
        </div>
    );
}
