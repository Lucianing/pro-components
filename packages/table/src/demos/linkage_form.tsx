/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

type GithubIssueItem = {
  key: number;
  name: string;
  createdAt: number;
};

const MySelect: React.FC<{
  state: {
    type: number;
  };
  /**
   * value 和 onChange 会被自动注入
   */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { state } = props;

  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    const { type } = state || {};
    if (type === 2) {
      setOptions([
        {
          label: '星期一',
          value: 1,
        },
        {
          label: '星期二',
          value: 2,
        },
      ]);
    } else {
      setOptions([
        {
          label: '一月',
          value: 1,
        },
        {
          label: '二月',
          value: 2,
        },
      ]);
    }
  }, [JSON.stringify(state)]);

  return <Select options={innerOptions} value={props.value} onChange={props.onChange} />;
};

export default () => {
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'state',
      initialValue: 1,
      valueType: 'select',
      request: async () => [
        {
          label: '月份',
          value: 1,
        },
        {
          label: '周',
          value: 2,
        },
        {
          label: '自定义',
          value: 3,
        },
      ],
    },
    {
      title: '动态表单',
      key: 'direction',
      hideInTable: true,
      dataIndex: 'direction',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        const stateType = form.getFieldValue('state');
        if (stateType === 3) {
          return <Input />;
        }
        return (
          <MySelect
            {...rest}
            state={{
              type: stateType,
            }}
          />
        );
      },
    },
  ];

  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      request={async () => {
        return {
          data: [
            {
              key: 1,
              name: `TradeCode ${1}`,
              createdAt: 1602572994055,
              state: 'closed',
            },
          ],
          success: true,
        };
      }}
      rowKey="key"
      tableLayout="fixed"
      dateFormatter="string"
      headerTitle="动态自定义搜索栏"
      search={{
        defaultCollapsed: false,
        optionRender: ({ searchText, resetText }, { form }) => [
          <Button
            key="search"
            type="primary"
            onClick={() => {
              form?.submit();
            }}
          >
            {searchText}
          </Button>,
          <Button
            key="rest"
            onClick={() => {
              form?.resetFields();
            }}
          >
            {resetText}
          </Button>,
          <Button key="out">导出</Button>,
        ],
      }}
      toolBarRender={() => [
        <Button key="3" type="primary">
          <PlusOutlined />
          新建
        </Button>,
      ]}
    />
  );
};
