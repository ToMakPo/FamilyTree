const infoBox = $('#info-box')
const infoText = $('#info-box p')

// Display the info when an element with info is focused.
$('[data-info]').on('focus', ({target}) => {
    infoBox.css('display', 'block')
    infoText.text(target.dataset.info)
})

// Close the info when not in use.
$('[data-info]').on('blur', () => {
    infoBox.css('display', 'none')
    infoText.text('')
})

$('[data-hover-info]').on('hover', ({target}) => {
    infoBox.css('display', 'block')
    infoText.text(target.dataset['hover-info'])
})