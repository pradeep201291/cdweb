import { PagerService } from './pagination.service';

let pagerService: PagerService;
let totalItems: number;

beforeEach(() => {
    pagerService = new PagerService();
});

describe('PagerService Validation', () => {
    it('Test For less Than 5 pages, max pages displayed ', () => {
        totalItems = 40;
        let result = pagerService.getPager(totalItems, 1);
        expect(result.startPage).toBe(1);
        expect(result.endPage).toBe(Math.ceil(totalItems / 10));
    });

    it('Test For more Than 5 pages, only 5 page should be displayed', () => {
        totalItems = 60;
        let result = pagerService.getPager(totalItems, 1);
        expect(result.startPage).toBe(1);
        expect(result.endPage).toBe(5);
    });

    it('Test For more Than 5 pages, not from within the same frame, start and end page belongs to next frame', () => {
        totalItems = 120;
        let result = pagerService.getPager(totalItems, 6, false);
        expect(result.currentPage).toBe(6);
        expect(result.pages[0]).toBe(6);
        expect(result.pages[4]).toBe(10);
    });

    it('Test For more Than 5 pages, within the same frame, start and end page belongs to same frame', () => {
        totalItems = 120;
        let result = pagerService.getPager(totalItems, 7);
        expect(result.currentPage).toBe(7);
        expect(result.pages[0]).toBe(6);
        expect(result.pages[4]).toBe(10);
    });

    it('Test For more Than 5 pages, currentPage<=0', () => {
        totalItems = 120;
        let result = pagerService.getPager(totalItems, 0);
        expect(result.pages[0]).toBe(1);
        expect(result.pages[4]).toBe(5);
    });

});
