import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@tencent/qcloud-lib';
import { allActions } from '../../actions';
import { RootProps } from '../ClusterApp';
import { router } from '../../router';
import { ResourceHeaderPanel } from './ResourceHeaderPanel';
import { ResourceActionPanel } from './resourceTableOperation/ResourceActionPanel';
import { ResourceTablePanel } from './resourceTableOperation/ResourceTablePanel';
import { ResourceDeleteDialog } from './resourceTableOperation/ResourceDeleteDialog';
import { ResourceSidebarPanel } from './ResourceSidebarPanel';
import { ComputerActionPanel } from './nodeManage/ComputerActionPanel';
import { ComputerTablePanel } from './nodeManage/ComputerTablePanel';
import { BatchDrainComputerDialog } from './nodeManage/BatchDrainComputerDialog';
import { ClusterDetailPanel } from './clusterInfomation/ClusterDetail';
import { ResourceLogPanel } from './resourceTableOperation/ResourceLogPanel';
import { ResourceEventPanel } from './resourceTableOperation/ResourceEventPanel';
import { isEmpty } from '../../../common/utils';
import { UpdateNodeLabelDialog } from './nodeManage/UpdateNodeLabelDialog';
import { t, Trans } from '@tencent/tea-app/lib/i18n';
import { ContentView, Justify, Text, ExternalLink, Alert } from '@tencent/tea-component';
import { SubRouter } from '../../models';
import { DeleteComputerDialog } from './nodeManage/DeleteComputerDialog';
import { TipInfo } from 'src/modules/common';
import { ComputerStatusDialog } from './nodeManage/ComputerStatusDialog';
import { BatchUnScheduleComputerDialog } from './nodeManage/BatchUnScheduleComputerDialog';
import { BatchTurnOnScheduleComputerDialog } from './nodeManage/BatchTurnOnScheduleComputerDialog';
import { UpdateNodeTaintDialog } from './nodeManage/UpdateNodeTaintDialog';

const loadingElement: JSX.Element = (
  <div>
    <i className="n-loading-icon" />
    &nbsp; <span className="text">{t('加载中...')}</span>
  </div>
);

export interface ResourceListPanelProps extends RootProps {
  /** subRouterList */
  subRouterList: SubRouter[];
}

const mapDispatchToProps = dispatch =>
  Object.assign({}, bindActionCreators({ actions: allActions }, dispatch), { dispatch });

@connect(
  state => state,
  mapDispatchToProps
)
export class ResourceListPanel extends React.Component<ResourceListPanelProps, {}> {
  render() {
    let { subRoot, route, subRouterList } = this.props,
      urlParams = router.resolve(route),
      { resourceInfo } = subRoot;
    let content: JSX.Element;
    let headTitle: string = '';
    let resource = urlParams['resourceName'];
    // 判断应该展示什么组件
    switch (resource) {
      case 'info':
        content = <ClusterDetailPanel {...this.props} />;
        headTitle = t('基础信息');
        break;

      case 'node':
        content = (
          <React.Fragment>
            <ComputerActionPanel />
            <ComputerTablePanel />
            <BatchUnScheduleComputerDialog />
            <BatchTurnOnScheduleComputerDialog />
            <UpdateNodeLabelDialog {...this.props} />
            <UpdateNodeTaintDialog />
            <DeleteComputerDialog {...this.props} />
            <ComputerStatusDialog
              dialogState={this.props.dialogState}
              computer={this.props.subRoot.computerState.computer}
            />
            <BatchDrainComputerDialog {...this.props} />
            <div id="ComputerMonitorPanel" />
          </React.Fragment>
        );
        headTitle = t('节点列表');
        break;

      case 'log':
        content = <ResourceLogPanel />;
        headTitle = t('日志');
        break;

      case 'event':
        content = <ResourceEventPanel />;
        headTitle = t('事件');
        break;
      default:
        content = isEmpty(resourceInfo) ? (
          loadingElement
        ) : (
          <React.Fragment>
            <ResourceActionPanel />
            <ResourceTablePanel />
          </React.Fragment>
        );

        headTitle = resourceInfo.headTitle;

        break;
    }

    return (
      <React.Fragment>
        <ContentView>
          <ContentView.Header>
            <ResourceHeaderPanel />
          </ContentView.Header>
          <ContentView.Body sidebar={<ResourceSidebarPanel subRouterList={subRouterList} />}>
            <ContentView>
              <ContentView.Header>
                <Justify
                  left={
                    <React.Fragment>
                      {resource === 'tapp' && (
                        <Alert style={{ marginBottom: '8px' }}>
                          <Text verticalAlign="middle">
                            {t(
                              'TApp是腾讯云自研的一种workload类型，支持有/无状态的应用类型，可进行Pod级别的指定删除、原地升级、挂载独立数据盘等操作，'
                            )}
                          </Text>
                          {/* <ExternalLink>了解更多</ExternalLink> */}
                        </Alert>
                      )}
                      <h2 className="tea-h2">{headTitle || ''}</h2>
                    </React.Fragment>
                  }
                />
              </ContentView.Header>
              <ContentView.Body>{content}</ContentView.Body>
            </ContentView>
          </ContentView.Body>
        </ContentView>
        <ResourceDeleteDialog />
      </React.Fragment>
    );
  }
}
