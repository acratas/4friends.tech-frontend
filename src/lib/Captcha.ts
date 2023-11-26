const getCaptchaToken = (): Promise<string>  => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        window.grecaptcha.ready(() => {
            // @ts-ignore
            window.grecaptcha.execute('6Lf4KVcoAAAAAK6LUGPreb7EaZpoQp-jJ8zE4rlJ', { action: 'call' })
                // @ts-ignore
                .then(token => {
                    resolve(token);
                })
                // @ts-ignore
                .catch(error => {
                    reject(error);
                });
        });
    });
}

export { getCaptchaToken }
