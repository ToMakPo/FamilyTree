const loginForm = $('#login-form')
const usernameLoginInput = $('#username-login-input')
const passwordLoginInput = $('#password-login-input')

const signupModal = $('#signup-modal')
const signupForm = $('#signup-form')
const firstNameSignupInput = $('#first-name-signup-input')
const lastNameSignupInput = $('#last-name-signup-input')
const usernameSignupInput = $('#username-signup-input')
const emailSignupInput = $('#email-signup-input')
const passwordSignupInput = $('#password-signup-input')
const confirmSignupInput = $('#confirm-signup-input')

const infoBox = $('#info-box')
const infoText = $('#info-box p')

// Open sign up modal when the user clicks the sign up button.
$('#signup-button').on('click', () => {
    signupModal.css('display', 'flex')
    // infoBox.css('display', 'none')
})

// Close the sign up modal when the user clicks the close button.
$('#close-signup-modal-button').on('click', () => {
    signupModal.css('display', 'none')
    // infoBox.css('display', 'none')
    signupForm[0].reset()
})

// Display the info when an element with info is focused.
$('[data-info]').on('focus', ({target}) => {
    infoBox.css('display', 'block')
    infoText.text(target.dataset.info)
})

// Close the info when not in use.
$('[data-info]').on('blur', () => {
    infoBox.css('display', 'none')
})

// Verify information then log the user in.
loginForm.on('submit', async event => {
    event.preventDefault()

    const values = {
        username: usernameLoginInput.val().trim(),
        password: passwordLoginInput.val().trim()
    }

    const data = await $.post('/login_user', values)

    if (!data.passed) {
        $(`#${data.issue}-login-input`).focus()
        displayError(data.error)
    } else {
        console.log('Passed');
        // loginForm[0].reset()
        $.post('login', values)
    }
})

// Verify information then create the user profile.
signupForm.on('submit', async event => {
    event.preventDefault()

    const values = {
        firstName: firstNameSignupInput.val().trim(),
        lastName: lastNameSignupInput.val().trim(),
        username: usernameSignupInput.val().trim(),
        email: emailSignupInput.val().trim(),
        password: passwordSignupInput.val().trim(),
        confirm: confirmSignupInput.val().trim()
    }

    const data = await $.post('/signup_user', values)

    if (!data.passed) {
        $(`#${data.issue}-signup-input`).focus()
        displayError(data.error)
    } else {
        signupForm[0].reset()
        $.post('login', values)
    }
})
