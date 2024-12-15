
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <title>login</title>
</head>
<body>
    <div class="container">
        <div class="form-container login">
            <div class="welcome-text">
                <h1>WELCOME<br/>BACK!</h1>
            </div>
            <form class="login-form" action="login.php" method="POST">
                <input type="hidden" name="action" value="login">
                <h2>Login</h2>
                <div class="input-group">
                    <input type="text" name="id" placeholder="ID" required>
                    <span class="icon">👤</span>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Password" required>
                    <span class="icon">🔒</span>
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <span class="toggle">Sign Up</span></p>
            </form>
            <?php if (isset($_GET['error']) || isset($_GET['message'])): ?>
                <div id="notification" class="<?php echo isset($_GET['error']) ? 'error' : 'message'; ?>">
                    <?php echo htmlspecialchars(isset($_GET['error']) ? $_GET['error'] : $_GET['message']); ?>
                </div>
            <?php endif; ?>
        </div>


        <div class="form-container signup">
            <form class="register-form" action="register.php" method="POST">
                <input type="hidden" name="action" value="register">
                <h2>Sign Up</h2>
                <div class="input-group">
                    <input type="text" name="id" placeholder="ID" required>
                    <span class="icon">ID</span>
                </div>
                <div class="input-group">
                    <input type="text" name="username" placeholder="Username" required>
                    <span class="icon">👤</span>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Password" required>
                    <span class="icon">🔒</span>
                </div>
                <button type="submit">Sign Up</button>
                <p>Already have an account? <span class="toggle">Login</span></p>
            </form>
            <div class="welcome-text">
                <h1>CREATE<br/>YOUR<br/>ACCOUNT</h1>
            </div>
        </div>
    </div>

    <script>
        document.querySelectorAll('.toggle').forEach(button => {
            button.addEventListener('click', () => {
                const container = document.querySelector('.container');
                
                if (container.classList.contains('flipped')) {
                    container.classList.remove('flipped');
                    container.classList.add('flipped-back');
                } else {
                    container.classList.remove('flipped-back');
                    container.classList.add('flipped');
                }
            });
        });
        window.addEventListener('DOMContentLoaded', () => {
            const notification = document.getElementById('notification');
            if (notification) {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 1500);
            }
        });

    </script>
</body>
</html>
