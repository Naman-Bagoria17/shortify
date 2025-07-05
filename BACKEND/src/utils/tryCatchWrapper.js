export default function wrapASync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };       
};
