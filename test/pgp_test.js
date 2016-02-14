import gpg from "gpg";



gpg.call("", ["--version"],
    (error, msg)=> {
        if (typeof error === 'null') {
            console.log("error");
            console.log(error);
            console.log(error.toString());
        }
        console.log("msg");
        console.log(msg);
        console.log(msg.toString());
    }
);



