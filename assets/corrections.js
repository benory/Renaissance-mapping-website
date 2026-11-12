(() => {
    const dialog = document.getElementById("correction-dialog");
    const content = dialog.querySelector(".correction-content");
    const eventLabel = document.getElementById("correction-event-id");
    const eventDetails = document.getElementById("correction-event-details");
    const form = document.getElementById("correction-form");
    const widget = document.getElementById("correction-turnstile");
    const status = document.getElementById("correction-status");
    const formActions = document.getElementById("correction-form-actions");
    const successActions = document.getElementById("correction-success-actions");
    const thanks = document.getElementById("correction-thanks");
    const submit = formActions.querySelector('button[type="submit"]');
    const closeButtons = dialog.querySelectorAll("[data-close-correction]");
    const configured = form.getAttribute("action") && widget.dataset.sitekey;
    const verificationError = "Verification is unavailable. Close and reopen the form to try again.";
    let turnstileScript;
    let widgetId;
    let pending = false;

    function showSuccess(show) {
        form.hidden = show;
        formActions.hidden = show;
        thanks.hidden = !show;
        successActions.hidden = !show;
    }

    function showStatus(message, error = false) {
        status.textContent = message;
        status.toggleAttribute("data-error", error);
    }

    function loadTurnstile() {
        turnstileScript ??= new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.onload = () => resolve(window.turnstile);
            script.onerror = () => {
                script.remove();
                reject(new Error("Could not load Turnstile"));
            };
            document.head.append(script);
        }).catch(error => {
            turnstileScript = undefined;
            throw error;
        });
        return turnstileScript;
    }

    async function startVerification() {
        try {
            const turnstile = await loadTurnstile();
            if (!dialog.open || widgetId !== undefined) return;

            widgetId = turnstile.render(widget, {
                sitekey: widget.dataset.sitekey,
                action: "event-correction",
                size: widget.clientWidth < 300 ? "compact" : "flexible",
                callback: () => {
                    submit.disabled = pending;
                    if (status.textContent === verificationError) showStatus("");
                },
                "expired-callback": () => {
                    submit.disabled = true;
                },
                "error-callback": () => {
                    submit.disabled = true;
                    if (!pending && !form.hidden) showStatus(verificationError, true);
                }
            });
        } catch {
            if (!dialog.open) return;
            showStatus(verificationError, true);
        }
    }

    document.getElementById("map").addEventListener("click", event => {
        const trigger = event.target.closest("[data-correction-event]");
        if (!trigger || dialog.open) return;
        const eventId = trigger.dataset.correctionEvent;
        if (!/^\d{5}$/.test(eventId)) return;

        eventLabel.textContent = eventId;
        const popupBody = trigger.closest(".event-popup").querySelector(".event-popup-body");
        eventDetails.replaceChildren(...popupBody.cloneNode(true).childNodes);
        eventDetails.scrollTop = 0;

        form.reset();
        form.elements.event_id.value = eventId;
        showSuccess(false);
        submit.disabled = true;
        showStatus(configured ? "" : "Online submission is unavailable.", !configured);
        dialog.showModal();
        content.scrollTop = 0;
        if (configured) startVerification();
    });

    closeButtons.forEach(button => button.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("cancel", event => {
        if (pending) event.preventDefault();
    });
    dialog.addEventListener("close", () => {
        if (widgetId === undefined) return;
        window.turnstile.remove(widgetId);
        widgetId = undefined;
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!configured || pending) return;

        const body = new URLSearchParams(new FormData(form));
        const description = body.get("description").trim();
        if (!description) {
            showStatus("Enter a description of the correction.", true);
            form.elements.description.focus();
            return;
        }
        if (!body.get("cf-turnstile-response")) {
            showStatus("Please complete the verification.", true);
            return;
        }
        body.set("description", description);

        pending = true;
        submit.disabled = true;
        closeButtons.forEach(button => { button.disabled = true; });
        showStatus("Submitting correction…");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body,
                signal: AbortSignal.timeout(20000)
            });
            if (!response.ok || !(await response.json()).ok) throw new Error("Submission failed");

            showSuccess(true);
            thanks.focus();
        } catch {
            showStatus("Your correction couldn’t be submitted. Please try again.", true);
            if (widgetId !== undefined) window.turnstile.reset(widgetId);
        } finally {
            pending = false;
            closeButtons.forEach(button => { button.disabled = false; });
        }
    });
})();
