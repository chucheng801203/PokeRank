class PageDataException {
    code: number;
    name: string;
    message: string;

    constructor() {
        this.code = 1;
        this.name = "PageDataException";
        this.message = "PageData 格式錯誤";
    }
}

export default PageDataException;
