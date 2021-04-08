import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
                setInterval(() => {
                    this.itemDetail = this.historyData.map(x => { return x.ScanId });
                    console.log(this.itemDetail);
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
                                this.templateMessage(res);
                            })
                        })
                }, 5000);


            })


    }

    templateMessage(res) {
        if (!this.itemDetail.includes(res.ScanId)) {
            this.itemDetail.push(res.ScanId);
            this.historyData = [res].concat(this.historyData)
        }
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