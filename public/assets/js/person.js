const toggleNameMenuButton = $('#toggle-name-menu-button')
const nameMenuDisplay = $('#name-menu-display')
let nameMenuDisplayed = false
const nameDisplayCheckboxes = $('.name-display-checkbox input')

toggleNameMenuButton.on('click', event => {
    event.preventDefault()
    if (nameMenuDisplayed) hideNameMenu()
    else showNameMenu()
})

function hideNameMenu() {
    nameMenuDisplayed = false
    nameMenuDisplay.addClass('hidden')
    toggleNameMenuButton.text('⋯')
}

function showNameMenu() {
    nameMenuDisplayed = true
    nameMenuDisplay.removeClass('hidden')
    toggleNameMenuButton.text('✖')
    nameMenuDisplay.focus()
}

// $(document).on('click', event => {
//     const target = $(event.target)
//     console.log({parents:target.parents});
//     // if (target != nameMenuDisplay && target.parents)
// })

nameMenuDisplay.focusout(() => hideNameMenu())

nameDisplayCheckboxes
    .on('click', ({target}) => toggleNameInputs(target))
    .each(function() {toggleNameInputs(this)})

function toggleNameInputs(checkbox) {
    const checked = checkbox.checked
    const input = $('#' + checkbox.value)

    checked ? input.show() : input.hide()
}