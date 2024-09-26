/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, FormInstance, Row, Select } from "antd";
import { FC, useCallback, useState } from "react";
import { Language } from "../../app/app";
import { GENDERS } from "../../constants";

const col_12 = {
  labelCol: { md: 4, xs: 24 },
  wrapper: { md: 20, xs: 24 },
};
interface Props {
  form: FormInstance<any>;
  label: string;
  name: string;
  languages?: Language[];
  lang: string;
}

const SelectVoice: FC<Props> = ({ form, label, name, languages, lang }) => {
  const [options, setOptions] = useState<Language[]>([]);
  const onChangeGender = useCallback(
    (e: GENDERS) => {
      const ops =
        languages?.filter(
          (i) => i.ssmlGender === e && i.languageCodes.includes(lang)
        ) || [];
      setOptions(ops);
    },
    [lang, languages]
  );
  return (
    <Form labelAlign="left" form={form}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={label}
            {...col_12}
            className="m-0"
            name={label.replace(" ", "")}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Select onChange={onChangeGender}>
                  {Object.entries(GENDERS).map(([key, value]) => {
                    return (
                      <Select.Option key={key} value={value}>
                        {key}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={12}>
                <Form.Item label={"Voice"} name={name}>
                  <Select>
                    {options.map((i) => {
                      return (
                        <Select.Option key={i.name} value={i.name}>
                          {i.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SelectVoice;
