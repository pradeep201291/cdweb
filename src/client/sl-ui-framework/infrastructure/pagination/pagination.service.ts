import { Injectable } from '@angular/core';
import { PaginationResource } from './pagination.resource';

@Injectable()
export class PagerService {
    getPager(totalItems: number, currentPage: number = PaginationResource.startPage,
        withinTheFrame: boolean = true, pageSize: number = PaginationResource.totalRecordsPerPage) {

        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= PaginationResource.totalPages || currentPage <= 0) {
            startPage = PaginationResource.startPage;
            endPage = totalPages;
        } else if (currentPage % PaginationResource.totalPages === 0) {
            startPage = Math.floor((currentPage - 1) / PaginationResource.totalPages) * PaginationResource.totalPages + 1;
            endPage = Math.min(startPage + (PaginationResource.totalPages - 1), totalPages);
        } else {
            startPage = Math.floor(currentPage / PaginationResource.totalPages) * PaginationResource.totalPages + 1;
            endPage = Math.min(startPage + (PaginationResource.totalPages - 1), totalPages);
        }

        if (!withinTheFrame) {
            currentPage = startPage;
        }

        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        let pages: number[] = new Array();
        for (let n = startPage; n <= endPage; n++) {
            pages.push(n);
        }
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
