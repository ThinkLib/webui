import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalState } from '../../../../global.state';
import { RestService } from '../../../../services/rest.service';

import { EntityUtils } from '../../../common/entity/utils';
import * as _ from 'lodash';

@Component({
  selector: 'app-lagg-list',
  template: `<entity-list [conf]="this"></entity-list>`
})
export class LaggListComponent {

  protected resource_name: string = 'network/lagg/';
  protected route_add: string[] = ['network', 'laggs', 'add'];
  protected route_delete: string[] = ['network', 'laggs', 'delete'];
  protected editIds: any = {};

  constructor(protected rest: RestService, protected router: Router, protected state: GlobalState) {

  }

  public columns: Array<any> = [
    { title: 'Lagg Interface', name: 'lagg_interface' },
    { title: 'Lagg Protocol', name: 'lagg_protocol' },
  ];
  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
  };

  getActions(row) {
    let actions = [];
    actions.push({
        label: "Edit Interface",
        onClick: (row) => {
            this.router.navigate(new Array('/pages').concat(
              ["network", "interfaces", "edit", this.editIds[row.lagg_interface]]));
        }
    });
    actions.push({
        label: "Delete",
        onClick: (row) => {
            this.router.navigate(new Array('/pages').concat(["network", "laggs", "delete", row.id]));
        },
    });
    return actions;
  }

  afterInit(entityList: any) {
    entityList.busy = this.rest.get('network/interface/', {}).subscribe((res) => {
      let interfaces = new EntityUtils().flattenData(res.data);
      let lagg_interface;
      for (let i = 0; i < entityList.rows.length; i++) {
        lagg_interface = entityList.rows[i]['lagg_interface'];
        this.editIds[lagg_interface] = _.find(interfaces, {'int_interface': lagg_interface}).id;
      }
    });

  }

}
