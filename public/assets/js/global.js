const toast = $('#toast')
function displayToast(message, bgColor, fgColor) {
    toast
        .css('background-color', bgColor || '#444')
        .css('color', fgColor || 'white')
        .text(message)
        .addClass('show')
    
    setTimeout(() => toast.removeClass('show'), 3000)
}
function displayError(message) {
    displayToast(message, 'FireBrick')
}
function displayCorrect(message) {
    displayToast(message, 'ForestGreen')
}