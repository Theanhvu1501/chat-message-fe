/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Divider, Form, Input, message, Row, Select } from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import ChatApp from "../components/chat/ChatApp";
import SelectVoice from "../components/select-voice/SelectVoice";
import { COLORS, LANGUAGES, TypeMapLanguageColor } from "../constants";

const col_12 = {
  labelCol: { md: 4, xs: 24 },
  wrapper: { md: 20, xs: 24 },
};

export interface ChatData {
  speaker: string;
  timestamp?: string;
  text: string;
  voiceName: string;
  voiceBase64?: string;
  lang?: LANGUAGES;
  name?: string;
}
export interface Language {
  languageCodes: string[];
  name: string;
  ssmlGender: string;
  naturalSampleRateHertz: number;
}
function App() {
  const [form] = useForm();
  const color = useWatch("color", form);
  const lang = useWatch("lang", form);
  const [listLangs, setListLangs] = useState<Language[]>();
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [colorChat, setColorChat] = useState<string>();
  const [name, setName] = useState<string>();
  const onChangeLanguage = useCallback(
    (e: LANGUAGES) => {
      form.resetFields();
      form.setFieldValue("lang", e);
      form.setFieldValue("color", TypeMapLanguageColor[e]);
    },
    [form]
  );

  const getVoicesName = useCallback(
    (data: {
      speaker: string;
      voice1: string;
      voice2: string;
      voice3?: string;
      voice4?: string;
    }) => {
      const { speaker, voice1, voice2, voice3, voice4 } = data;
      if (speaker?.includes("4")) return voice4 || voice1;
      if (speaker?.includes("3")) return voice3 || voice1;
      if (speaker?.includes("2")) return voice2;
      return voice1;
    },
    []
  );

  const parseTranscript = useCallback(
    (formValues: any) => {
      const { data, voice1, voice2, voice3, voice4, lang, name } = formValues;
      const transcript: ChatData[] = [];
      const lines = data.split("\n");
      const regex = /(Speaker \d+): \[(\d{2}:\d{2}:\d{2})\] (.+)/;
      lines.forEach(async (line: string) => {
        const match = line.match(regex);
        if (match) {
          const speaker = match[1];
          const text = match[3];
          const voiceName = getVoicesName({
            speaker,
            voice1,
            voice2,
            voice3,
            voice4,
          });
          transcript.push({ speaker, text, voiceName, lang, name });
        }
      });

      return transcript;
    },
    [getVoicesName]
  );

  const onConfig = useCallback(async () => {
    try {
      setLoading(true);
      const formValues = form.getFieldsValue();
      const result = parseTranscript(formValues);
      await api.config(result);
      setColorChat(formValues.color);
      setName(formValues.name);
      message.success("Config thành công!");
    } catch (error) {
      message.error("Config thất bại!");
    } finally {
      setLoading(false);
    }
  }, [form, parseTranscript]);

  const fetch = useCallback(async () => {
    const languages = await api.getVoices();
    setListLangs(languages);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        {!hasUserInteracted ? (
          <div className="bg-white w-2/3 rounded-lg shadow-lg">
            <div
              className="w-full  bg-red-100 h-[50px] transition ease-in-out delay-150"
              style={{
                backgroundColor: color,
              }}
            ></div>
            <div className="w-full p-4">
              <Form labelAlign="left" form={form}>
                <Row gutter={32}>
                  <Col span={12}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Language" name={"lang"} {...col_12}>
                          <Select onChange={onChangeLanguage}>
                            {Object.entries(LANGUAGES).map(([key, value]) => {
                              return (
                                <Select.Option key={key} value={value}>
                                  {key}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Color" {...col_12} name={"color"}>
                          <Select>
                            {Object.entries(COLORS).map(([key, value]) => {
                              return (
                                <Select.Option key={key} value={value}>
                                  {key}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Name" name={"name"} {...col_12}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    {Array.from({ length: 4 }, (_, i) => {
                      return (
                        <SelectVoice
                          key={i}
                          lang={lang}
                          languages={listLangs}
                          label={`Speaker ${i + 1}`}
                          form={form}
                          name={`voice${i + 1}`}
                        />
                      );
                    })}
                    <Divider />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          loading={loading}
                          className="w-full rounded-none"
                          onClick={onConfig}
                        >
                          Config
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          loading={loading}
                          className="w-full rounded-none"
                          onClick={() => {
                            const formValues = form.getFieldsValue();
                            setName(formValues.name);
                            setColorChat(formValues.color);
                            setHasUserInteracted(true);
                          }}
                        >
                          Start
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Text" name={"data"}>
                      <TextArea rows={21}></TextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        ) : (
          <ChatApp color={colorChat} name={name} />
        )}
      </div>
    </>
  );
}

export default App;
