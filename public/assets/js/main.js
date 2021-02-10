$('#logout-button').on('click', event => {
    event.preventDefault()

    location.replace('/logout')
})