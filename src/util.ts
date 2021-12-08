import queryString from "query-string";

/**
 * 取得網址 query string 的參數值
 * @param string param
 * @param string search string
 */
export const getParameterByName = (
    name: string,
    search: string = window.location.search
) => {
    const params = queryString.parse(search);
    return params ? (params[name] as string) : undefined;
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

/**
 * 回傳寶可夢屬性對應色碼
 * @param index number
 * @returns string
 */
export const getPmTypeColor = (index: number): string => {
    // pokemon 屬性區塊的背景色
    const pokemonTypeColor: {
        [index: string]: string;
    } = {
        0: "#9099a1",
        1: "#ce406a",
        2: "#8fa8dd",
        3: "#ab6ac8",
        4: "#d97745",
        5: "#c7b78b",
        6: "#90c12d",
        7: "#5369ac",
        8: "#598ea1",
        9: "#ff9c54",
        10: "#4e90d6",
        11: "#63bb5b",
        12: "#f4d23c",
        13: "#f97177",
        14: "#73cec0",
        15: "#0a6dc4",
        16: "#5a5366",
        17: "#ed8fe6",
    };

    return pokemonTypeColor[index] ? pokemonTypeColor[index] : "";
};
