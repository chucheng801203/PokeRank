/**
 * 取得網址 query string 的參數值
 * @param string
 * @param string
 */
export const getParameterByName = (
    name: string,
    url: string = window.location.href
) => {
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * 檢查自己和父元素的 position 屬性是否有 fixed
 * @param element HTMLElement
 */
export const checkParentHasFixedProp = (element: HTMLElement): boolean => {
    if (getComputedStyle(element).getPropertyValue("position") === "fixed") {
        return true;
    } else if (element.parentElement) {
        return checkParentHasFixedProp(element.parentElement);
    }

    return false;
};

/**
 * 當連續執行某個 function 時，直到最後一次執行才會真的觸發 function
 * @param func
 */
export const debounce = (func: (e?: Event) => void, delay: number) => {
    var timer: number;
    return function (event: Event) {
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(func, delay, event);
    };
};

/**
 * 檢查 parentElement 使否包含 element
 * @param parentElement
 * @param element
 */
export const contains = (
    parentElement: HTMLElement,
    element: Node | undefined | null
): boolean => {
    if (parentElement === element) {
        return true;
    }

    while ((element = element?.parentNode)) {
        if (element === parentElement) return true;
    }
    return false;
};

/**
 * 取得 ReactNode 文字
 * @param ReactNode
 */
export const getNodeText = (node: any): string => {
    if (["string", "number"].includes(typeof node)) return node;
    if (node instanceof Array) return node.map(getNodeText).join("");
    if (typeof node === "object" && node)
        return getNodeText(node.props.children);

    return "";
};
