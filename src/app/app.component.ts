import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'habeco';
    constructor(
        private http: HttpClient,
    ) { }

    listData: any = [];
    itemDetail: any = [];

    ngOnInit() {
        this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/scan?pageNumber=1&pageSize=20`)
            .subscribe((res: any) => {
                res.payload = res.payload || [];
                this.listData = res.payload.map(x => {
                    return {
                        ScanId: x.ScanId,
                        CreatedOn: x.CreatedOn,
                        href: '#collapse1-' + x.ScanId,
                        id: 'collapse1-' + x.ScanId,
                        dataSub: [],
                        ItemNumber: x.ItemNumber
                    }
                });
            })
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
                console.log(this.itemDetail);
            })
    }


}
