export const HttpUtil = {
    fetchGetAsync: async (url, params, withCredentials) => {
        if (params) {
            url += "?";
            var paramsBody = Object.keys(params)
                .reduce((a, k) => {
                    a.push(k + "=" + encodeURIComponent(params[k].toString()));
                    return a;
                }, [])
                .join('&');
            url += paramsBody;
        }

        var options = {
            method: 'GET'
        };

        if (withCredentials) {
            options.withCredentials = "include";
        } else {
            var token = localStorage.getItem("accessToken");
            options.headers = {
                'Authorization': `Bearer ${token}`
            }
        }

        var response = await fetch(url, options);
        return await response.json();
    },

    fetchAsync: async (url, params, method, withCredentials) => {
        var options = {
            method: method,
            body: `${JSON.stringify(params)}`
        };

        if (withCredentials) {
            options.withCredentials = "include";
            options.headers = {
                'Content-Type': 'application/json'
            }
        } else {
            var token = localStorage.getItem("accessToken");
            options.headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        var response = await fetch(url, options);
        return await response.json();
    },
}

export const CreateFile = (reqFile, type) => {
    var base64str = reqFile;

    // decode base64 string, remove space for IE compatibility
    var binary = atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }

    //var file = new File([view], reqFile.name, { type: 'application/pdf', lastModified: new Date(reqFile.date) });
    var file;
    if (type)
        file = new Blob([view], { type: type });
    else
        file = new Blob([view], { type: 'application/pdf' });
    file.name = reqFile.name;
    file.lastModified = new Date(reqFile.date);
    var url = URL.createObjectURL(file);

    file.preview = url;
    return file;
};
