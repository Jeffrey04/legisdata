import { Button, Form, ListGroup, Nav } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ReactHtmlParser from "react-html-parser";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLoaderData, useLocation, useSubmit } from "react-router-dom";
import type { RootState } from "../app/store";
import { submit } from "../features/search/query-slice";

function NoResult() {
	return <div>No result is returned</div>;
}

function checkIsDocumentType(data, documentType: string) {
	return (
		Array.isArray(data) &&
		data.length > 0 &&
		data[0].document_type === documentType
	);
}

function HansardContentList({ data, documentType, anchorPrefix }) {
	return checkIsDocumentType(data, documentType) ? (
		<ListGroup>
			{data.map((item, idx: number) => (
				<ListGroup.Item key={"li".concat(idx.toString())}>
					<p>
						{ReactHtmlParser(item?.content?.highlight || item?.content?.value)}
					</p>
					<p>
						<Icon.ListOl />{" "}
						<Link
							to={"/hansard/".concat(
								item?.hansard?.id.toString(),
								"#hansard-",
								anchorPrefix,
								"-",
								item?.content?.id?.toString(),
							)}
						>
							Hansard #{item?.hansard?.id}
						</Link>{" "}
						<Icon.Person />
						<strong>
							{" ".concat(item?.person?.name || "TIDAK TERJUMPA")}
						</strong>
					</p>
				</ListGroup.Item>
			))}
		</ListGroup>
	) : (
		<NoResult />
	);
}

function RespondList({ data }) {
	return checkIsDocumentType(data, "respond") ? (
		<ListGroup>
			{data.map((item, idx: number) => (
				<ListGroup.Item key={"li".concat(idx.toString())}>
					<p>
						{ReactHtmlParser(item?.content?.highlight || item?.content?.value)}
					</p>
					<p>
						<Icon.FileEarmarkCheck /> Jawapan untuk pertanyaan
						{item?.inquiry?.is_oral ? " mulut " : " bertulis "}
						bertajuk{" "}
						<Link
							to={"/inquiry/".concat(
								item?.inquiry?.id,
								"#inquiry-jawapan-",
								item?.content?.id?.toString(),
							)}
						>
							{(item?.inquiry?.title ?? "").concat(" ")}
						</Link>
						<Icon.Person />
						<strong>{" ".concat(item?.person?.name ?? "")}</strong>
					</p>
				</ListGroup.Item>
			))}
		</ListGroup>
	) : (
		<NoResult />
	);
}

function InquiryList({ data }) {
	return checkIsDocumentType(data, "inquiry") ? (
		<ListGroup>
			{data.map((item, idx: number) => (
				<ListGroup.Item key={"li".concat(idx.toString())}>
					<p>
						{ReactHtmlParser(item?.content?.highlight || item?.content?.value)}
					</p>
					<p>
						<Icon.QuestionSquare /> Pertanyaan
						{item?.inquiry?.is_oral ? " mulut " : " bertulis "}
						bertajuk{" "}
						<Link
							to={"/inquiry/".concat(
								item?.inquiry?.id,
								"#inquiry-pertanyaan-",
								item?.content?.id?.toString(),
							)}
						>
							{(item?.inquiry?.title ?? "").concat(" ")}
						</Link>
						<Icon.Person />
						<strong>{" ".concat(item?.person?.name ?? "")}</strong>
					</p>
				</ListGroup.Item>
			))}
		</ListGroup>
	) : (
		<NoResult />
	);
}

function InquiryTitleList({ data }) {
	return checkIsDocumentType(data, "inquiry-title") ? (
		<ListGroup>
			{data.map((item, idx: number) => (
				<ListGroup.Item key={"li".concat(idx.toString())}>
					<Link to={"/inquiry/".concat(item?.content?.id?.toString())}>
						{ReactHtmlParser(
							"#".concat(
								item?.content?.number?.toString(),
								" - ",
								item?.content?.highlight || item?.content?.title,
							),
						)}
					</Link>
					<br />
					<Icon.PersonRaisedHand />{" "}
					<em>
						pertanyaan
						{item?.content?.is_oral ? " mulut " : " bertulis "}
					</em>
					daripada <strong>{item?.inquirer?.name}</strong>
				</ListGroup.Item>
			))}
		</ListGroup>
	) : (
		<NoResult />
	);
}

export default function Search() {
	const query = useSelector((state: RootState) => state.query);
	const data = useLoaderData();
	const dispatch = useDispatch();
	const submitForm = useSubmit();
	const search = new URLSearchParams(useLocation().search);

	const queryText = query.queryText ?? search.get("queryText");
	const documentType = query.documentType ?? search.get("documentType");

	return (
		<>
			<h1>Search</h1>
			<Form
				onSubmit={(e) => {
					e.preventDefault();

					const data = {
						queryText: e.target.querySelector("#search-query").value,
						documentType: query.documentType ?? "inquiry-title",
					};

					dispatch(submit(data));

					submitForm(data, {
						method: "get",
						action: "/search",
					});
				}}
			>
				<Form.Group>
					<Form.Label>Query text</Form.Label>
					<Form.Control id="search-query" defaultValue={queryText} />
				</Form.Group>
				<Button className="mt-2" variant="primary" type="submit">
					Search
				</Button>
			</Form>
			<h2>
				Search result
				{query.queryText && (
					<>
						{" "}
						for <em>{query.queryText}</em>
					</>
				)}
			</h2>
			<Nav variant="tabs" activeKey={query.documentType ?? "inquiry-title"}>
				<Nav.Item>
					<Nav.Link
						eventKey="inquiry-title"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "inquiry-title",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Inquiry Title
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="inquiry"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "inquiry",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Inquiry Content
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="respond"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "respond",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Inquiry Respond
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="question"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "question",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Hansard Question
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="answer"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "answer",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Hansard Answer
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="speech"
						onClick={(e) => {
							e.preventDefault();

							const data = {
								queryText: query.queryText,
								documentType: "speech",
							};

							dispatch(submit(data));

							submitForm(data, {
								method: "get",
								action: "/search",
							});
						}}
					>
						Hansard Speech
					</Nav.Link>
				</Nav.Item>
			</Nav>
			{documentType === "inquiry-title" && <InquiryTitleList data={data} />}
			{documentType === "inquiry" && <InquiryList data={data} />}
			{documentType === "respond" && <RespondList data={data} />}
			{documentType === "question" && (
				<HansardContentList
					data={data}
					documentType={documentType}
					anchorPrefix="pertanyaan"
				/>
			)}
			{documentType === "answer" && (
				<HansardContentList
					data={data}
					documentType={documentType}
					anchorPrefix="jawapan"
				/>
			)}
			{documentType === "speech" && (
				<HansardContentList
					data={data}
					documentType={documentType}
					anchorPrefix="ucapan"
				/>
			)}
		</>
	);
}
