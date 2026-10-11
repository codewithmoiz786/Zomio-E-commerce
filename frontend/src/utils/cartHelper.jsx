export const triggerCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"))
}