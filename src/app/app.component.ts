import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'habeco';

    constructor(
        private http: HttpClient,
        private renderer: Renderer2
    ) { }

    listData: any = [];
    historyData: any = [];
    itemDetail: any = [];
    fetch$: Observable<any>;
    @ViewChild('parentElement') parentElement: ElementRef;

    ngOnInit() {
        this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/scan?pageNumber=1&pageSize=20`)
            .subscribe((res: any) => {
                res.payload = res.payload || [];
                this.historyData = res.payload.map(x => {
                    return {
                        ScanId: x.ScanId,
                        CreatedOn: x.CreatedOn,
                        href: '#collapse1-' + x.ScanId,
                        id: 'collapse1-' + x.ScanId,
                        dataSub: [],
                        ItemNumber: x.ItemNumber
                    }
                });
                this.itemDetail = this.historyData.map(x => { return x.id });
            })


    }
    ngAfterViewInit() {
        setInterval(() => {
            this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/scan?pageNumber=1&pageSize=20`)
                .subscribe((res: any) => {
                    res.payload = res.payload || [];
                    this.fetch$ = from(res.payload.map(x => {
                        return {
                            ScanId: x.ScanId,
                            CreatedOn: x.CreatedOn,
                            href: '#collapse1-' + x.ScanId,
                            id: 'collapse1-' + x.ScanId,
                            dataSub: [],
                            ItemNumber: x.ItemNumber
                        }
                    }));
                    this.fetch$.subscribe(res => {
                        if (this.itemDetail.includes(res.id)) {
                            this.templateMessage(res);
                        }
                    })
                })
        }, 5000);
    }

    templateMessage(res) {
        this.historyData = [res].concat(this.historyData).slice(0, 20);
    }


    getDetailScan = (i) => {
        this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/scan/item?scanId=${i.ScanId}&pageNumber=1&pageSize=20`)
            .subscribe((res: any) => {
                res.payload = res.payload || []
                i.dataSub = res.payload;
            })
    }

    onLoadListScan = (item) => {
        this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/item?itemId=${item.ItemId}`)
            .subscribe((res: any) => {
                this.itemDetail = res.payload[0] || {};
            })
    }


}