import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
  Modal,
} from "antd";
import { ImageSvg } from "assets/svg/icon";
import service from "auth/FetchInterceptor";
import CustomIcon from "components/util-components/CustomIcon";
import { languageValidator, numberValidator } from "constants/helperFunctions";
import {
  ARABIC_alpha,
  ENGLISH_ALPH,
  NUMBER_CONSTANTS,
} from "constants/LanguagesConstent";
import React, { useEffect, useState } from "react";

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter product description",
    },
  ],
  price: [
    {
      required: true,
      message: "Please enter product price",
    },
  ],
  comparePrice: [],
  taxRate: [
    {
      required: true,
      message: "Please enter tax rate",
    },
  ],
  cost: [
    {
      required: true,
      message: "Please enter item cost",
    },
  ],
};

const imageUploadProps = {
  name: "file",
  multiple: true,
  listType: "picture-card",
  showUploadList: false,
};

const GeneralField = (props) => {
  // const imgList = React.useMemo(() =>
  //   props.postObject.subImages.map((element, index) => ({
  //     uid: index,
  //     url: element,
  //     name: "image.png",
  //   }))
  // ); Seaction

  const [test, setTest] = useState([]);
  const [singleImage, setSingleImage] = useState("");
  const [feildChecker, setFeildChecker] = useState({
    name_en: true,
    name_ar: true,
    description_ar: true,
    description_en: true,
    price: true,
    down_payment_value: true,
  });
  //Upload Seaction
  const filteredTags = props?.tagsList?.filter(
    (element) => element.service_id === 3
  );
  useEffect(() => {
    const test1 = props.postObject?.images?.map((element) => {
      let newObj = {};
      newObj["url"] = element.image;
      newObj["id"] = element.id;
      return newObj;
    });
    setTest(test1);
  }, [props.postObject.images]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const uploadHandler = async (options, name) => {
    const key = "updatable";
    message.loading({ content: "Loading...", key, duration: 15 });

    const imageObject = { type: "Doctor", file: options.file };
    const data = new FormData();
    try {
      for (const key of Object.keys(imageObject)) {
        data.append(key, imageObject[key]);
      }
      const uploadResponse = await service.post("/upload_media", data);
      message.success({
        content: `${uploadResponse.fileName} Uploaded Successfully!`,
        key,
        duration: 2,
      });
      if (name === "main_image") {
        props.setPostObject({
          ...props.postObject,
          main_image: uploadResponse.fileName,
          preview_image: uploadResponse.file_url,
        });
      } else {
        props.setPostObject({
          ...props.postObject,
          images: [
            ...props.postObject.images,
            {
              id: Math.floor(Math.random() * 10000),
              image: uploadResponse.file_url,
            },
          ],
        });
      }
    } catch (error) {
      message.error({ content: `Error!`, key, duration: 2 });
    }
  };
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item
            required
            hasFeedback
            style={{
              display: "inline-block",
              width: "calc(50% - 5px)",

              marginRight: 8,
            }}
            name="name_ar"
            label="Name in Arabic"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const checkValidation = languageValidator(
                    value.toLowerCase(),
                    ARABIC_alpha
                  );
                  if (checkValidation) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Please enter The Name in Arabic");
                  }
                },
              }),
            ]}
          >
            <Input
              name="name_ar"
              onPressEnter={(e) => e.preventDefault()}
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  name_ar: event.target.value,
                })
              }
              placeholder="Please enter Product Name in Arabic"
            />
          </Form.Item>

          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 5px)",
            }}
            required
            name="name_en"
            label="Name in English"
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const checkValidation = languageValidator(
                    value.toLowerCase(),
                    ENGLISH_ALPH
                  );
                  if (checkValidation) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Please enter The Name in English");
                  }
                },
              }),
            ]}
          >
            <Input
              name="name_en"
              onPressEnter={(e) => e.preventDefault()}
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  name_en: event.target.value,
                })
              }
              placeholder="Please enter Product Name in English"
            />
          </Form.Item>

          <Form.Item
            required
            name="description_ar"
            label="Description in Arabic"
            rules={[
              feildChecker.description_ar
                  ? []
                  : ({ getFieldValue }) => ({
                    // validator(_, value) {
                    //   const checkValidation = languageValidator(
                    //       value,
                    //       // ARABIC_alpha
                    //       //ARABIC_NUMBER_CHAR
                    //   );
                    //   // if (checkValidation) {
                    //   //   props.setButtonChecker(true);
                    //   //   return Promise.resolve();
                    //   // }
                    //   // else {
                    //   //   props.setButtonChecker(false);
                    //   //   return Promise.reject(
                    //   //       "Please enter The Description in Arabic"
                    //   //   );
                    //   // }
                    // },
                  }),
            ]}
          >
            <Input.TextArea
              name="description_ar"
              placeholder="Enter the Description in Arabic"
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  description_ar: event.target.value,
                })
              }
              rows={4}
            />
          </Form.Item>

          <Form.Item
            required
            name="description_en"
            label="Description in English"
            rules={[
              feildChecker.description_en
                  // ? []
                  // : ({ getFieldValue }) => ({
                  //   validator(_, value) {
                  //     const checkValidation = languageValidator(
                  //         lowerCase(value),
                  //         // ENGLISH_ALPH
                  //       //  ENGLISH_Number_CHAR
                  //     );
                  //     // if (checkValidation) {
                  //     //   props.setButtonChecker(true);
                  //     //   return Promise.resolve();
                  //     // } else {
                  //     //   props.setButtonChecker(false);
                  //     //   return Promise.reject(
                  //     //       "Please enter The Description in English"
                  //     //   );
                  //     // }
                  //   },
                  // }),
            ]}
          >
            <Input.TextArea
              name="description_en"
              placeholder="Enter the Description in English"
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  description_en: event.target.value,
                })
              }
              rows={4}
            />
          </Form.Item>
          <Form.Item
            name="clinic_id"
            required
            label={<span>Clinic &nbsp;</span>}
          >
            <Select
              showSearch
              placeholder="Select a Clinic"
              optionFilterProp="children"
              disabled={props.storeIdProp ? true : false}
              defaultValue={props.storeIdProp && parseInt(props.storeIdProp)}
              onChange={(e) =>
                props.setPostObject({ ...props.postObject, clinic_id: e })
              }
              value={props.postObject.clinic_id}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.services?.map((element) => (
                <Option value={element.id}>{element?.name_en}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            required
            label="Price"
            name="price"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!numberValidator(value, NUMBER_CONSTANTS)) {
                    return Promise.reject("Your Cant include Charcters");
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
            className="w-100"
          >
            <Input
              name="price"
              placeholder="Enter the Price"
              addonAfter="EGP"
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  price: event.target.value,
                })
              }
              className="w-100"
            />
          </Form.Item>
          {/* <Form.Item
            label="Down Payment"
            name="down_payment_value"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!numberValidator(value, NUMBER_CONSTANTS)) {
                    return Promise.reject("Your Cant include Charcters");
                  } else if (value > 100) {
                    return Promise.reject(
                      "Your Cant Number Cant be Greater Than 100"
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
            className="w-100"
          >
            <Input
              name="down_payment_value"
              placeholder="Enter the Down Payment"
              addonAfter={"%"}
              onChange={(event) =>
                props.setPostObject({
                  ...props.postObject,
                  down_payment_value: event.target.value,
                })
              }
              className="w-100"
            />
          </Form.Item> */}
          <Form.Item required name="tags" label="Tags">
            <Select
              optionFilterProp="children"
              onChange={(e) =>
                props.setPostObject({ ...props.postObject, tags: e })
              }
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Please Select Your Tags"
            >
              {filteredTags?.map((elm) => (
                <Option value={elm.id} key={elm.id}>
                  {elm.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Media">
          <Form.Item required label="Main Image">
            <Dragger
              name="main_image"
              {...imageUploadProps}
              customRequest={(options) => uploadHandler(options, "main_image")}
            >
              {props.postObject.main_image ? (
                <img
                  src={props.postObject.preview_image}
                  alt="avatar"
                  className="img-fluid"
                />
              ) : (
                <div>
                  {props.postObject.preview_image ? (
                    <div>
                      <LoadingOutlined className="font-size-xxl text-primary" />
                      <div className="mt-3">Uploading</div>
                    </div>
                  ) : (
                    <div>
                      <CustomIcon className="display-3" svg={ImageSvg} />
                      <p>Click or drag file to upload</p>
                    </div>
                  )}
                </div>
              )}
            </Dragger>
          </Form.Item>

          <Form.Item required label="Sub Images">
            <Upload
              disabled={props.checkView}
              // fileList={props?.postObject?.images}
              fileList={test}
              onPreview={(t) => setSingleImage(t.url)}
              onRemove={(t) => {
                props.setPostObject({
                  ...props.postObject,
                  images: props?.postObject?.images?.filter(
                    (element) => element.id !== t.id
                  ),
                });
              }}
              customRequest={(options) => uploadHandler(options, "images")}
              listType="picture-card"
            >
              {props.postObject?.images?.length >= 4 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Modal
            visible={singleImage.length > 0}
            footer={null}
            onCancel={() => setSingleImage("")}
          >
            <img
              alt="image"
              style={{ width: "100%", height: 350 }}
              src={singleImage}
            />
          </Modal>
        </Card>
        {/* <Card title="Organization">
          <Form.Item name="details" label="Details">
            <Select
              optionFilterProp="children"
              onChange={(e) =>
                props.setPostObject({ ...props.postObject, details: e })
              }
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: "100%" }}
              placeholder="Please Select a Detail"
            >
              {props.gerericDetailesList?.TYPE?.map((elm) => (
                <Option value={elm.id} key={elm.id}>
                  {elm.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>
        
        </Card> */}
      </Col>
    </Row>
  );
};

export default GeneralField;
