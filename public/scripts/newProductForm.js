const form = document.querySelector('form')

form.addEventListener('submit', async e => {
    try {
        e.preventDefault();

        const formData = new FormData(form);
        const urlSearchParams = new URLSearchParams();

        for (const pair of formData) {
            urlSearchParams.append(pair[0], pair[1]);
        }

        const res = await fetch(form.action, {
            method: form.method,
            body: urlSearchParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await res.json();
        console.log(data);

        if (data.status === 201) {
            Swal.fire({
                title: 'Product created successfully',
                icon: 'success'
            }).isConfirmed(res => console.log(res));
        } else {
            Swal.fire({
                title: 'Error',
                text: `Error ${data.status}: ${data.response}`,
                icon: 'error'
            });
        }
    } catch (error) {
        console.log(error);
    }
})