export const getClicked = async () => {
    const raw = await fetch("http://localhost:3002/getClicked", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    return await raw.json();
}

export const click = async () => {
    const raw = await fetch("http://localhost:3002/click", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    return await raw.json();
}