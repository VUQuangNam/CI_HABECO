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
        private http: HttpClient
    ) { }

    listData: any = [];

    ngOnInit() {
        this.http.get('https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/scan?pageNumber=20&pageSize=0')
            .subscribe((res: any) => {
                this.listData = res.payload.map(x => {
                    return {
                        ScanId: x.ScanId,
                        CreatedOn: x.CreatedOn,
                        ItemId: x.ItemId,
                        href: '#collapse1-' + x.ScanId,
                        id: 'collapse1-' + x.ScanId,
                        dataSub: []
                    }
                });
            })
    }


    getDetailScan = (i) => {
        this.http.get(`https://mxupvjfqlh.execute-api.ap-southeast-1.amazonaws.com/prod/item?itemId=${i.ItemId}`)
            .subscribe((res: any) => {
                i.dataSub = res.payload;
            })

    }
}
