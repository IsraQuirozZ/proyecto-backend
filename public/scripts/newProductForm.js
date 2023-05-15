const form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    let data = {}
    for (let i = 0; i < form.length; i++) {
        const input = form[i];
        // const {name, value} = input;
        data = {...data}
    }
    console.log(data)
    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.status === 201) {
            Swal.fire({
                title: 'Product created successfully',
                icon: 'success'
            }).isConfirmed(res => console.log(res))
        } else {
            Swal.fire({
                title: 'error',
                text: `Error ${data.status}: ${data.response}`,
                icon: 'error'
            })
        }
    })
    .catch(err => console.log(err))
})